import { AiOutlineClose } from "react-icons/ai";
import { useState } from "react";
import LoadingSvg from "./loading.svg";

const Mash = ({ children }) => {
  return (
    <div className="fixed left-0 top-0  w-screen h-screen  bg-[rgba(0,0,0,0.4)] flex items-center justify-center z-50">
      {children}
    </div>
  );
};

export default ({ children, title, show, onClose }) => {
  return show ? (
    <Mash>
      <div className="rounded-2xl bg-white p-4 inline-block min-w-[300px] max-w-[80vw]">
        <div className="flex justify-between items-center">
          <div className="flex-1">{title}</div>
          <div
            className=" rounded-full bg-slate-100 text-xs p-1 font-thin cursor-pointer"
            onClick={() => onClose && onClose()}
          >
            <AiOutlineClose />
          </div>
        </div>
        <div className=" text-gray-600 mt-4">{children}</div>
        <div className="flex justify-center mt-4">
          <div
            onClick={() => onClose()}
            className={`cursor-pointer min-w-[6rem] text-center bg-slate-300 px-4 py-1 rounded-2xl`}
          >
            ok
          </div>
        </div>
      </div>
    </Mash>
  ) : (
    <div className=" hidden" />
  );
};

export const useModal = () => {
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("message");
  const [content, setContent] = useState("content");

  return {
    model: {
      show,
      children: content,
      title,
    },
    showMessage: (message, title) => {
      setTitle(title), setContent(message);
      setShow(true);
    },
    close: () => {
      setShow(false);
    },
  };
};

export const Loading = ({ show }) => {
  return show ? (
    <Mash>
      <img className=" w-20" src={LoadingSvg} alt="" />
    </Mash>
  ) : (
    <div className=" hidden"></div>
  );
};
export const useLoading = () => {
  const [show, setShow] = useState(false);
  return {
    show,
    loading: () => {
      setShow(true);
    },
    closeLoading: () => setShow(false),
  };
};
