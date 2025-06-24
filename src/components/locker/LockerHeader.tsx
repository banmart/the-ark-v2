
import React from 'react';

const LockerHeader = () => {
  return (
    <div className="text-center py-8">
      <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
        Token Locker
      </h1>
      <p className="text-gray-400 text-lg">
        Lock your tokens to earn rewards based on commitment duration
      </p>
    </div>
  );
};

export default LockerHeader;
