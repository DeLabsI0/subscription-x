import React, { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import styles from '../styles/Portal.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft, faTimes } from '@fortawesome/free-solid-svg-icons';
import { ConnectPanel } from './ConnectPanel';
import { AccountPanel } from './AccountPanel';




export default function SubPortal(props: any){
    const [currentPanel, setPanel] = useState(0);
    const { active, account, library, chainId } = useWeb3React();

    useEffect(():any=>{
        if(active === false){
            setPanel(0);
        }
        else if (active === true){
            setPanel(1);
        }
    },[active, account, library, chainId]);


    if(props.show === true){

        return(
            <>
                <div className={styles.overlay}>
                    <div className={styles.portalContainer}>

                        {currentPanel === 0 && <ConnectPanel />}
                        {currentPanel === 1 && <AccountPanel />}
                        
                        <button className={styles.closeButton} onClick={props.handleClose}>
                            <FontAwesomeIcon icon={faTimes} size='xs' className={styles.iconStyle}/>
                        </button>
                        {currentPanel !== 2 && active &&
                            <button className={styles.nextButton} onClick={()=>setPanel(currentPanel+1)}>
                                <FontAwesomeIcon icon={faArrowRight} size="sm" className={styles.iconStyle} />
                            </button>
                        }
                        {currentPanel !== 0 &&
                            <button className={styles.lastButton} onClick={()=>setPanel(currentPanel-1)}>
                                <FontAwesomeIcon icon={faArrowLeft} size="sm" className={styles.iconStyle} />
                            </button>
                        }
                    </div>
                </div>
             </>
            )
        }
    else{
        return null;
    }
}
