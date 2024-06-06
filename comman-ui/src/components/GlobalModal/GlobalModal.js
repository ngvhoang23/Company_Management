import classNames from 'classnames/bind';
import styles from './GlobalModal.module.scss';
import LoadingModal from '../LoadingModal/LoadingModal';
import { useContext, useEffect } from 'react';
import { IsLoadingContext } from '~/Context/LoadingContext';
import { ConfirmContext } from '~/Context/ConfirmContext';
import ConfirmBox from '~/components/ConfirmBox';
import { ResultStatusContext } from '~/Context/ResultStatusContext';
import StatusModal from '../StatusModal/StatusModal';
import { PopUpContext } from '~/Context/PopUpContext';
import ChangePasswordByAdminPopUp from '../ChangePasswordByAdminPopUp/ChangePasswordByAdminPopUp';
import ChangePasswordPopUp from '../ChangePasswordPopUp/ChangePasswordPopUp';

const cx = classNames.bind(styles);

function GlobalModal({ children }) {
    const isLoadingContext = useContext(IsLoadingContext);
    const isLoading = isLoadingContext.isLoading;

    const confirmContext = useContext(ConfirmContext);
    const confirmFunc = confirmContext.confirmFunc;

    const resultStatusContext = useContext(ResultStatusContext);
    const resultStatus = resultStatusContext.status;
    const setResultStatus = resultStatusContext.setStatus;

    const popUpContext = useContext(PopUpContext);
    const popUp = popUpContext.popUp;
    const setPopUp = popUpContext.setPopUp;

    return (
        <>
            {isLoading && <LoadingModal />}
            {confirmFunc && (
                <ConfirmBox
                    content={confirmFunc?.content}
                    onAprrove={confirmFunc?.onAprrove}
                    onReject={confirmFunc?.onReject}
                />
            )}
            {resultStatus && (
                <StatusModal
                    status={resultStatus?.status}
                    content={resultStatus.message}
                    onClose={() => setResultStatus()}
                />
            )}
            {popUp?.emp_id && popUp?.emp_id != -1 && <ChangePasswordByAdminPopUp user_id={popUp?.emp_id} />}
            {popUp?.emp_id == -1 && <ChangePasswordPopUp />}
            {children}
        </>
    );
}

export default GlobalModal;
