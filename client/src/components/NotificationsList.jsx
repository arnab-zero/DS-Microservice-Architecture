import PropTypes from "prop-types";
import Notification from "./Notification";

const NotificationsList = ({ notifications }) => {
  return (
    <div>
      <h3 className="mt-5 mb-4 text-black text-lg font-medium">
        Notifications
      </h3>
      <div>
        {notifications.map((notification) => (
          <Notification key={notification._id} notification={notification} />
        ))}
      </div>
    </div>
  );
};

NotificationsList.propTypes = {
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string,
      message: PropTypes.string,
      date: PropTypes.string, // Adjust these fields based on actual data structure
    })
  ).isRequired,
};

export default NotificationsList;
