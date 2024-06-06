import { ConfirmProvider } from '~/Context/ConfirmContext';
import { IsFetchProfileProvider } from '~/Context/IsFetchProfileContext';
import { IsLoadingProvider } from '~/Context/LoadingContext';
import { PopUpProvider } from '~/Context/PopUpContext';
import { ResultStatusProvider } from '~/Context/ResultStatusContext';
import { UserInfoProvider } from '~/Context/UserInfoContext';

function ContextWrapper({ children }) {
    return (
        <ResultStatusProvider>
            <ConfirmProvider>
                <UserInfoProvider>
                    <PopUpProvider>
                        <IsFetchProfileProvider>
                            <IsLoadingProvider>{children}</IsLoadingProvider>
                        </IsFetchProfileProvider>
                    </PopUpProvider>
                </UserInfoProvider>
            </ConfirmProvider>
        </ResultStatusProvider>
    );
}

export default ContextWrapper;
