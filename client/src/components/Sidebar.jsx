import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { SiShopware } from 'react-icons/si';
import { MdOutlineCancel } from 'react-icons/md';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { AiOutlineCalendar, AiOutlineAreaChart, AiOutlineStock , AiOutlineBarChart } from 'react-icons/ai';
import { FiShoppingBag } from 'react-icons/fi';
import { BsKanban } from 'react-icons/bs';
import { IoMdContacts } from 'react-icons/io';
import { RiContactsLine } from 'react-icons/ri';
import { useStateContext } from '../contexts/ContextProvider';

const link1 = [
  {
    title: 'Dashboard',
    links: [
      {
        name: 'E-learning',
        icon: <FiShoppingBag />,
      },
    ],
  },
  {
    title: 'Pages',
    links: [
      {
        name: 'Instructors',
        icon: <IoMdContacts />,
      },
      {
        name: 'Learners',
        icon: <RiContactsLine />,
      },
    ],
  },
  {
    title: 'Apps',
    links: [
      {
        name: 'calendar',
        icon: <AiOutlineCalendar />,
      },
      {
        name: 'ToDo',
        icon: <BsKanban />,
      },
    ],
  },
  {
    title: 'Courses',
    links: [
      {
        name: 'Live Classes',
        icon: <AiOutlineAreaChart />,
      },
      {
        name: 'Recorded Courses',
        icon: <AiOutlineStock />,
      },
    ],
  },
  {
    title: 'Charts',
    links: [
      {
        name: 'stacked',
        icon: <AiOutlineBarChart />,
      },
    ],
  },
];

const link2 = [
  {
    title: 'Pages',
    links: [
      {
        name: 'Learners',
        icon: <RiContactsLine />,
      },
    ],
  },
  {
    title: 'Apps',
    links: [
      {
        name: 'calendar',
        icon: <AiOutlineCalendar />,
      },
      {
        name: 'ToDo',
        icon: <BsKanban />,
      },
    ],
  },
  {
    title: 'Courses',
    links: [
      {
        name: 'Live Classes',
        icon: <AiOutlineAreaChart />,
      },
      {
        name: 'Recorded Courses',
        icon: <AiOutlineStock />,
      },
    ],
  },
];

const link3 = [
  {
    title: 'Apps',
    links: [
      {
        name: 'calendar',
        icon: <AiOutlineCalendar />,
      },
    ],
  },
  {
    title: 'Courses',
    links: [
      {
        name: 'Live Classes',
        icon: <AiOutlineAreaChart />,
      },
      {
        name: 'Recorded Courses',
        icon: <AiOutlineStock />,
      },
    ],
  },
];

const Sidebar = () => {
  const { currentColor, activeMenu, setActiveMenu, screenSize } = useStateContext();

  // Determine links based on user role
  const userRole = localStorage.getItem('loginAs');
  let links = [];

  if (userRole === 'student') {
    links = link3;
  } else if (userRole === 'teacher') {
    links = link2;
  } else if (userRole === 'admin') {
    links = link1;
  }

  const handleCloseSideBar = () => {
    if (activeMenu !== undefined && screenSize <= 900) {
      setActiveMenu(false);
    }
  };

  const activeLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-white text-md m-2';
  const normalLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-700 dark:text-gray-200 dark:hover:text-black hover:bg-light-gray m-2';

  return (
    <div className="ml-3 h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10">
      {activeMenu && (
        <>
          <div className="flex justify-between items-center">
            <Link to="/" onClick={handleCloseSideBar} className="items-center gap-3 ml-3 mt-4 flex text-xl font-extrabold tracking-tight dark:text-white text-slate-900">
              <SiShopware /> <span>E-LEARNING DASHBOARD</span>
            </Link>
            <TooltipComponent content="Menu" position="BottomCenter">
              <button
                type="button"
                onClick={() => setActiveMenu(!activeMenu)}
                style={{ color: currentColor }}
                className="text-xl rounded-full p-3 hover:bg-light-gray mt-4 block md:hidden"
              >
                <MdOutlineCancel />
              </button>
            </TooltipComponent>
          </div>
          <div className="mt-10">
            {links.map((item) => (
              <div key={item.title}>
                {item.links.length > 0 && (
                  <p className="text-gray-400 dark:text-gray-400 m-3 mt-4 uppercase">
                    {item.title}
                  </p>
                )}
                {item.links.map((link) => (
                  <NavLink
                    to={`/${link.name}`}
                    key={link.name}
                    onClick={handleCloseSideBar}
                    style={({ isActive }) => ({
                      backgroundColor: isActive ? currentColor : '',
                    })}
                    className={({ isActive }) => (isActive ? activeLink : normalLink)}
                  >
                    {link.icon}
                    <span className="capitalize ">{link.name}</span>
                  </NavLink>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
