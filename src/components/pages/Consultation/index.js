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
  const [activeConsultation, setActiveConsultation] = useState(null); // TODO: Change Hardcode
  const [consultations, setConsultations] = useState({});
  const [tab, setTab] = useState(1);


  const onTabChange = (to) => {
    setTab(to)
  }

  const onMessageSubmit = (msg) => {
    if(!consultations[activeConsultation].practitioner) {
      fetch('http://localhost:8081/register/patient_practitioner', {
        method: "POST",
        body: JSON.stringify({
          patient: consultations[activeConsultation].patient,
          practitioner: PRACTIONER_ID}
        ),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      })
      .then(() => {
        setConsultations(prevConsultations => ({
            ...prevConsultations,
            [activeConsultation]: {
              ...prevConsultations[activeConsultation],
              practitioner: PRACTIONER_ID
            }
          }))
          setTab(0)
        })
      .then(() => wsUtil.send(socket, activeConsultation, msg))
    } else {
      wsUtil.send(socket, activeConsultation, msg);
    }
  };

  useEffect(() => {
    fetch(`http://localhost:8081/consultation/${PRACTIONER_ID}`)
    .then(data => data.json())
    .then(data => {
      data.forEach(consultationWrapper => {
        const {patient, consultation } = consultationWrapper;
        setConsultations(prevConsultations => ({
          ...prevConsultations,
          [consultation._id]: {
            ...consultation,
            name: `${patient.name.first_name} ${patient.name.last_name}`
          }
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
    setActiveConsultation(consultationId);
  }

  return (
    <>
      <CssBaseline />
      <DefaultLayout>
        <Layout>
          <SideNav
            activeTab={tab}
            onTabChange={onTabChange}
            onClick={onSidebarItemClicked}
            consultations={consultations}
            activeConvo={activeConsultation}/>
          { activeConsultation ? 
            <Messages
              onMessageSubmit={onMessageSubmit}
              room={activeConsultation}
              consultation={(consultations[activeConsultation] || {name: '', messages: []})} />
              :
              <div/>
          }
        </Layout>
      </DefaultLayout>
    </>
  );
};

Consultation.propTypes = {};

export default Consultation;
