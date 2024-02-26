'use client'
import React, { ReactNode, useState } from 'react';
import { ChevronDoubleDownIcon, ChevronDoubleRightIcon } from '@heroicons/react/24/outline';

interface PropType {
  title: string,
  children: ReactNode,
  className?: string,
  disabled?: boolean,
}

const Card = ({ title, children, className, disabled = false }: PropType) => {
  const [isOpen, setIsOpen] = useState(true); // State to manage collapse

  // Tailwind CSS classes for animation
  const contentBaseClasses = "transition-[max-height,opacity] duration-700 ease-in-out overflow-hidden";
  const contentOpenClasses = "max-h-[2000px] opacity-100"; // Adjust max-h value as needed
  const contentClosedClasses = "max-h-0 opacity-0";
  return (
    <div className={`${className} max-w-full mx-auto mb-auto bg-custom-gray p-4 rounded-lg shadow-md`}>
      <div className={`flex items-center ${disabled ? '' : ' cursor-pointer'}`} onClick={() => { if (!disabled) setIsOpen(!isOpen) }}>
        {isOpen ? <ChevronDoubleDownIcon className="w-5 h-5 mr-2" /> : <ChevronDoubleRightIcon className="w-5 h-5 mr-2" />}
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className={`${contentBaseClasses} ${isOpen ? contentOpenClasses : contentClosedClasses} mt-4`}>
        {children}
      </div>
    </div>
  );
};

export default Card;
