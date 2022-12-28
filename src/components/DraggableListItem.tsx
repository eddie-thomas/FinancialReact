import * as React from "react";
import { Draggable } from "react-beautiful-dnd";

import { Avatar, ListItem, ListItemAvatar, ListItemText } from "@mui/material";

interface Item {
  id: null;
}

export type DraggableListItemProps = {
  item: Item;
  index: number;
};

const DraggableListItem = ({ item, index }: DraggableListItemProps) => {
  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided, _snapshot) => (
        <ListItem
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <ListItemAvatar>
            <Avatar>{/* Icon */}</Avatar>
          </ListItemAvatar>
          <ListItemText primary={item.primary} secondary={item.secondary} />
        </ListItem>
      )}
    </Draggable>
  );
};

export default DraggableListItem;
