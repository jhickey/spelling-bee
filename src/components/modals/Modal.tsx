import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';

import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

const Transition = React.forwardRef(
  (
    props: TransitionProps & {
      children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
  ) => <Slide direction="up" ref={ref} {...props} />
);

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactElement<any, any>;
}

export default function Modal({ open, onClose, children }: ModalProps) {
  const handleClose = () => {
    onClose();
  };

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        fullWidth
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogContent>{children}</DialogContent>
      </Dialog>
    </div>
  );
}
