import { ReactElement } from "react";
import Spinner from "react-spinkit";

interface LoadingModalProps {
  spinner?: ReactElement;
  message?: string;
}

export function LoadingModal({ spinner, message }: LoadingModalProps) {
  return (
    <div className="bg-slate-800 flex flex-col hakkunde py-8 px-12 rounded-3xl shadow-2xl">
      {spinner ?? <Spinner name="cube-grid" color="white" fadeIn="quarter" />}
      <span className="mt-6 text-white">{message ?? "Please wait..."}</span>
    </div>
  );
}
