"use client"

import { FloatingWhatsApp } from '@carlos8a/react-whatsapp-floating-button';

const WhatssapContact = () => {
  return (
    <div>
      <FloatingWhatsApp
        phoneNumber='+923051070920' // Required
        accountName='Essa.store' // Optional
        avatar='/Logo.jpg' // Optional
        initialMessageByServer='Hi there! How can I assist you?' // Optional
        initialMessageByClient='Hello! I found your contact on your website. I would like to chat with you about...' // Optional
        statusMessage='Available' // Optional
        startChatText='Start chat with us' // Optional
        tooltipText='Need help? Click to chat!' // Optional
        allowEsc={true} // Optional
        // Explore all available props below
      />
    </div>
  );
};

export default WhatssapContact;