import type { NextPage } from "next";
import { UseFormRegisterReturn } from "react-hook-form";

interface InputProps {
    label: string;
    register: UseFormRegisterReturn;
    id: string;
    type: "text" | "email" | "password";
    required?: boolean;
    strong?: boolean;
}

const Input: NextPage<InputProps> = ({
    label,
    register,
    id,
    type,
    required = true,
    strong = undefined,
}) => {
    return (
        <>
            <div className="flex justify-between items-center">
                <label htmlFor={id} className="text-gray-800 text-sm font-bold">
                    {label}
                </label>
                {strong !== undefined && type === "password" ? (
                    <div className="flex items-center text-xs space-x-1">
                        <span className="text-gray-600 font-semibold">
                            {strong ? "Strong" : "Leaked"}
                        </span>
                        {strong ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-green-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-red-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        )}
                    </div>
                ) : null}
            </div>
            <input
                {...register}
                id={id}
                type={type}
                required={required}
                className="py-2 px-4 w-full border rounded-md border-gray-300 focus:outline-none focus:ring-4 focus:ring-opacity-20 focus:border-blue-400 focus:ring-blue-400 transition disabled:opacity-50 disabled:cursor-not-allowed "
            />
        </>
    );
};

export default Input;
