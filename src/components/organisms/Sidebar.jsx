import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = ({ isOpen, onClose }) => {
  const navItems = [
    { path: "/", icon: "Home", label: "Dashboard" },
    { path: "/habits", icon: "CheckSquare", label: "Habits" },
    { path: "/journal", icon: "BookOpen", label: "Journal" },
    { path: "/goals", icon: "Target", label: "Goals" },
    { path: "/calendar", icon: "Calendar", label: "Calendar" },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 bg-surface border-r border-gray-700 h-full">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name="Brain" size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-100">MindFlow</h1>
              <p className="text-xs text-gray-400">Personal Growth</p>
            </div>
          </div>
          
          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-gray-700/50 group",
                    isActive
                      ? "bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 text-white"
                      : "text-gray-300 hover:text-white"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <ApperIcon
                      name={item.icon}
                      size={20}
                      className={cn(
                        "transition-colors duration-200",
                        isActive
                          ? "text-primary"
                          : "text-gray-400 group-hover:text-gray-300"
                      )}
                    />
                    <span className="font-medium">{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />
          <div className="absolute left-0 top-0 h-full w-64 bg-surface border-r border-gray-700 transform transition-transform duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                    <ApperIcon name="Brain" size={20} className="text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-100">MindFlow</h1>
                    <p className="text-xs text-gray-400">Personal Growth</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" size={20} className="text-gray-400" />
                </button>
              </div>
              
              <nav className="space-y-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-gray-700/50 group",
                        isActive
                          ? "bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 text-white"
                          : "text-gray-300 hover:text-white"
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <ApperIcon
                          name={item.icon}
                          size={20}
                          className={cn(
                            "transition-colors duration-200",
                            isActive
                              ? "text-primary"
                              : "text-gray-400 group-hover:text-gray-300"
                          )}
                        />
                        <span className="font-medium">{item.label}</span>
                      </>
                    )}
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;