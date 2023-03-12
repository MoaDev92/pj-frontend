import React, { useState } from "react";
import { BACKEND_URI } from "../../config";

const Sidebar = ({
  sidebarButtons,
  userInfo,
  setCurrentComponent,
  setOpacity,
  setShowAdditionalButtons,
}) => {
  const [sideButtonsSelectable, setSideButtonsSelectable] =
    useState(sidebarButtons);

  const handleSidebarButton = (e) => {
    if (setShowAdditionalButtons) {
      setShowAdditionalButtons(false);
    }
    setCurrentComponent(e.currentTarget.id);
    setOpacity("opacity-25");
    setTimeout(() => {
      setOpacity(" opacity-100 ");
    }, 100);

    let index = e.target.value;
    let buttonId = e.currentTarget.id;

    if (!index) {
      index = sideButtonsSelectable.findIndex(
        (button) => button.onClick === buttonId
      );
    }

    /**
     * find the preselected button and diselect it
     * select the new one
     */

    const preSelectedButton = sideButtonsSelectable.find(
      (button, index) => button.isSelected === true
    );

    if (preSelectedButton) {
      preSelectedButton.isSelected = false;
    }

    const selectedButton = sideButtonsSelectable.find(
      (button) => button.onClick === buttonId
    );
    selectedButton.isSelected = true;

    const newButtons = sideButtonsSelectable.filter(
      (button) => button.onClick !== buttonId
    );
    newButtons.splice(index, 0, selectedButton);

    setSideButtonsSelectable(newButtons);
  };

  return (
    <div className={` h-auto border  bg-gray-50   print:hidden`}>
      {sideButtonsSelectable.map((button, index) => {
        let selectedButtonStyle;
        if (button.isSelected === true) {
          selectedButtonStyle =
            "mr-2 border-l-4  bg-gray-200 flex w-full p-5 duration-300 hover:bg-indigo-200";
        } else {
          selectedButtonStyle =
            "mr-2 flex w-full p-5 duration-300 hover:bg-indigo-200";
        }
        return (
          <button
            style={{
              color: `${button.color.data.attributes.rgb}`,
              borderLeftColor: `${button.color.data.attributes.rgb}`,
            }}
            value={index}
            className={selectedButtonStyle}
            id={button.onClick}
            onClick={handleSidebarButton}
            key={button.id}
          >
            <img
              src={`${BACKEND_URI}${button.icon.data.attributes.url}`}
              className="mr-2 w-5"
            ></img>
            <span className="hidden duration-300 sm:block">
              {button.label === "username" ? userInfo.username : button.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default Sidebar;
