import {styled} from '@mui/material';
import { TooltipProps } from './Tooltip.props';
import MaterialTooltip, { TooltipProps as MaterialTooltipProps, tooltipClasses as materialTooltipClasses} from '@mui/material/Tooltip';

const CustomTooltip = styled(({ className, ...props }: MaterialTooltipProps) => (
    <MaterialTooltip {...props} arrow classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${materialTooltipClasses.arrow}`]: {
      color: theme.palette.mode === 'dark' ? "#FFFFFF" : theme.palette.common.black,
    },
    [`& .${materialTooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.mode === 'dark' ? "#FFFFFF" : theme.palette.common.black,
      color: theme.palette.mode === 'dark' ? "#000000" : "#FFFFFF",
    },
  }));

const Tooltip = ({children, title}: TooltipProps): JSX.Element => {
    return (
        <CustomTooltip title={title} placement="top">
            {children}
        </CustomTooltip>
    );
};

export default Tooltip;