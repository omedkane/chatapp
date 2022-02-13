import { BsInfo } from "react-icons/bs";

export function InfoModal({ message }: { message: string }) {
  return (
    <div className="flex flex-col hakkunde bg-slate-800 text-white py-8 px-6">
      <div className="flex hakkunde h-12 w-12 radius-1/2 bg-blue-600">
        <BsInfo color="white" size={24} />
      </div>
      <span className="mt-6 font-medium">{message}</span>
    </div>
  );
}
