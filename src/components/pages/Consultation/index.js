import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import CssBaseline from '@material-ui/core/CssBaseline';

import DefaultLayout from '../../templates/DefaultLayout';
import Messages from '../../organisms/Messages';
import SideNav from '../../organisms/SideNav';
import wsUtil from '../../../utils/webSocket';
import { CONSULTATION_ID, PRACTIONER_ID } from '../../../utils/Constants.js';

const Layout = styled.div`
  display: flex;
`;

const socket = wsUtil.getSocket();

const Consultation = ({}) => {
  const [activeConsultation, setActiveConsultation] = useState(CONSULTATION_ID); // TODO: Change Hardcode
  const [consultations, setConsultations] = useState({});

  const onMessageSubmit = (msg) => {
    wsUtil.send(socket, activeConsultation, msg);
  };

  useEffect(() => {
    fetch(`http://localhost:8081/consultation/${PRACTIONER_ID}`)
    .then(data => data.json())
    .then(data => {
      data.forEach(consultation => {
        setConsultations(prevConsultations => ({
          ...prevConsultations,
          [consultation._id]: consultation
        }))
      })
    })
    .catch(error => console.error(error)) 
  }, [])

  useEffect(() => {
    wsUtil.addMessageListener(socket, (data) => {
      const { consultation, msg } = data;
      setConsultations((prevConsultations) => ({
        ...prevConsultations,
        [consultation]: {
          ...prevConsultations[consultation],
          messages: [ ...(prevConsultations[consultation].messages || []), msg]
        }
      }));
    });
  }, []);
  
  const onSidebarItemClicked = consultationId => {
    console.log('aaa', consultationId)
    setActiveConsultation(consultationId);
  }

  return (
    <>
      <CssBaseline />
      <DefaultLayout>
        <Layout>
          <SideNav
            onClick={onSidebarItemClicked}
            consultations={consultations}
            activeConvo={activeConsultation}/>
          <Messages
            onMessageSubmit={onMessageSubmit}
            room={activeConsultation}
            messages={(consultations[activeConsultation] || {messages: []}).messages}
          />
        </Layout>
      </DefaultLayout>
    </>
  );
};

Consultation.propTypes = {};

export default Consultation;
