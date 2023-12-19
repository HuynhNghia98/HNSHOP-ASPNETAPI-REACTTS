import React from 'react';

interface CartStepProps {
    number: number;
    label: string;
    isActive?: boolean;
}

const CartStep: React.FC<CartStepProps> = ({ number, label, isActive }) => {
    const backgroundColor = isActive ? 'bg-dark' : 'bg-body-secondary';

    return (
        <div className={`col-2 justify-content-center`}>
            <div className={`row ${backgroundColor} p-4 rounded-5`}>
                <div className="col-3 p-0">
                    <span className="bg-white px-4 py-3 rounded-5 fw-bold">{number}</span>
                </div>
                <div className={`col fw-bold ${isActive ? 'text-white' : ''}`}>{label}</div>
            </div>
        </div>
    );
};

export default CartStep;