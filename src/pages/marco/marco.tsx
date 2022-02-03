import { Link, useParams } from "react-router-dom";

export const Marco = () => {
  const urlParams = useParams();
  return (
    <div className="flex flex-col hw-full bg-red-500 hakkunde">
      <Link to="/reus/Paolo">
        <div className="flex bg-white h-48 w-48 rounded-full hakkunde cursor-pointer">
          <span className="text-black">{urlParams.name}</span>
        </div>
      </Link>
    </div>
  );
};
