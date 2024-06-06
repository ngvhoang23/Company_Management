import classNames from 'classnames/bind';
import styles from './DateTimePicker.module.scss';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const cx = classNames.bind(styles);

function DateTimePicker({ defaultValue, onChange }) {
    return (
        <div className={cx('wrapper')}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DateTimePicker']}></DemoContainer>
            </LocalizationProvider>
        </div>
    );
}

export default DateTimePicker;
