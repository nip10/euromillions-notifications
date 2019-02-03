import React from 'react';
import './ActionMenu.css';

interface IActionsMenuProps {
  toggleFormType: (formType: string) => void,
}

const ActionMenu = (props: IActionsMenuProps) => {
  return (
    <div className="actionmenu-container">
      <span onClick={() => props.toggleFormType('edit')}>Edit Notification</span>
      <span onClick={() => props.toggleFormType('delete')}>Delete Notification</span>
    </div>
  )
}

export default ActionMenu;
