import { BsCheckAll } from "react-icons/bs";

export function SuccessModal({ message }: { message?: string }) {
  return (
    <div className="flex flex-col hakkunde bg-slate-800 text-white py-8 px-6">
      <div className="flex hakkunde h-12 w-12 radius-1/2 bg-green-600">
        <BsCheckAll color="white" size={24} />
      </div>
      <span className="mt-6 font-medium">{message ?? "Successfully Done"}</span>
    </div>
  );
}
