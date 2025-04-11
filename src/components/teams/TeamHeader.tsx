
import React from 'react';

interface TeamHeaderProps {
  title: string;
  description: string;
}

const TeamHeader = ({ title, description }: TeamHeaderProps) => {
  return (
    <div className="flex flex-col space-y-2">
      <h1 className="text-3xl font-bold text-football-blue">{title}</h1>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default TeamHeader;
