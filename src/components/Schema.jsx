
//toasts
import { toast } from 'react-hot-toast';
import VerifiedIcon from '@mui/icons-material/Verified';
import NewReleasesIcon from '@mui/icons-material/NewReleases';

export const showToast = (type, message) => {
    const commonConfig = {
        duration: 3000,
        position: 'top-center',
        ariaProps: { role: 'status', 'aria-live': 'polite' },
    };

    if (type === 'success') {
        toast(
            <div className="flex center g5">
                <VerifiedIcon />
                {message}
            </div>,
            {
                ...commonConfig,
                style: { color: 'rgb(0, 189, 0)' },
                className: 'success',
            }
        );
    } else if (type === 'error') {
        toast(
            <div className="flex center g5">
                <NewReleasesIcon />
                {message}
            </div>,
            {
                ...commonConfig,
                style: { color: 'red' },
                className: 'failed',
            }
        );
    }
};

//format date and time
export const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    if (isNaN(date)) return null;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = date.getDate().toString().padStart(2, '0');
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${day} ${month} ${year}, ${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
};