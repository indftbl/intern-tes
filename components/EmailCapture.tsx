import React, { useState } from 'react';

const TYPEFORM_URL = 'https://form.typeform.com/to/U0EMWosJ';

const EmailCapture: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleClick = () => {
    window.open(TYPEFORM_URL, '_blank');
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-white/90 backdrop-blur-xl border border-white/20 p-8 rounded-xl shadow-2xl mt-12 text-center">
        <h3 className="text-2xl font-bold text-blue-600">Thank You!</h3>
        <p className="text-gray-600 mt-2">We've got your info. We'll be in touch with the best new opportunities for you!</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-white/90 backdrop-blur-xl border border-white/20 p-8 rounded-xl shadow-2xl mt-12 text-center relative overflow-hidden">
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-blue-300/50 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-fuchsia-300/50 rounded-full filter blur-3xl animate-pulse animation-delay-4000"></div>

        <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-2 text-gray-900">Don't see the perfect fit?</h3>
            <p className="text-gray-600 mb-6">Don't worry, we've got you covered. Get notified when new roles that match your profile are added!</p>
            <button
            onClick={handleClick}
            className="w-full sm:w-auto inline-block bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold py-3 px-8 rounded-md hover:scale-105 transform transition-transform duration-300"
            >
            Notify Me
            </button>
      </div>
    </div>
  );
};

export default EmailCapture;