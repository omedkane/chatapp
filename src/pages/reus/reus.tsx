import { Link, useParams } from "react-router-dom";

export const Reus = () => {
  const urlParams = useParams();
  return (
    <div className="flex flex-col hw-full bg-green-500 hakkunde">
      <Link to="/marco/Dybala">
        <div className="flex bg-white h-48 w-48 rounded-full hakkunde cursor-pointer">
          <span className="text-black">{urlParams.name}</span>
        </div>
      </Link>
    </div>
  );
};
