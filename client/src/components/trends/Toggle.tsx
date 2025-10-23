interface ToggleProps {
  checked: boolean;
  setChecked: (action: boolean) => void;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}
const Toggle: React.FC<ToggleProps> = ({ checked, setChecked, onClick }) => {
  return (
    <>
      <div
        onClick={(e) => {
          onClick(e);
          setChecked(!checked);
        }}
        className="relative cursor-pointer"
      >
        <div
          className={`w-5 h-5  ${
            checked ? "right-0 bg-[#6cc24a]" : "left-0 bg-[#f4f4f4]"
          } absolute top-[-4px] rounded-full`}
        ></div>
        <div
          className={`w-8 h-3 ${
            checked ? "bg-gray-50" : "bg-gray-50"
          }  border border-gray-50 rounded-[16px]`}
        ></div>
      </div>
    </>
  );
};

export default Toggle;
