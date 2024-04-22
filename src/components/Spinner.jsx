import { BallTriangle, Watch } from "react-loader-spinner";

export default function Spinner() {
    return (
        <div className="flex items-center justify-center py-10">
              <BallTriangle
  height={250}
  width={250}
  radius={5}
  color="#4fa94d"
  ariaLabel="ball-triangle-loading"
  wrapperStyle={{}}
  wrapperClass=""
  visible={true}
  />

        </div>
    )
}