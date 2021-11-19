import {useEffect} from 'react';
import { ReceiptModalProps } from '../Receiptmodal.props';
import {Dialog, DialogActions, DialogTitle, DialogContent, IconButton, Button} from "@mui/material";
import { styled } from '@mui/material/styles';
// Icons
import CloseIcon from '@mui/icons-material/Close';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
  }));
  
    interface DialogTitleProps {
    id: string;
    children?: React.ReactNode;
    onClose: () => void;
  }

  const BootstrapDialogTitle = (props: DialogTitleProps) => {
    const { children, onClose, ...other } = props;
  
    return (
      <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
        {children}
        {onClose ? (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </DialogTitle>
    );
  };

const ReceiptModal = ({open, onClose}: ReceiptModalProps): JSX.Element => {
    
    useEffect(() => {
       console.log("Testing");
    }, []);

    return (
        <BootstrapDialog
        onClose={onClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={onClose}>
          Пример лицевого счета
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <img src={`/images/receipt-example.svg`} alt="МДО Хумо" />
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={onClose}>
            Понятно
          </Button>
        </DialogActions>
      </BootstrapDialog>
    );
};

export default ReceiptModal;