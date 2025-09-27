import { useState, useEffect } from "react";

function Users({ users }) {
  const [filteredUsers, setFilteredUsers] = useState(users);

  function handleSearch(query) {
    setFilteredUsers(
      users.filter((user) =>
        (user.real_name || user.name)
          ?.toLowerCase()
          .includes(query.toLowerCase())
      )
    );
  }

  return (
    <>
      {users.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Loading users...</span>
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Slack Users</h2>
            <p className="text-sm text-gray-600 mt-1">
              {filteredUsers.length} users found
            </p>
            <input
              placeholder="Search for a user"
              type="search"
              onChange={(e) => handleSearch(e.target.value)}
              className="border border-[#e1e8ed] my-2 rounded-full w-full p-2 text-[0.95rem]"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full table-fixed divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User ID
                  </th>
                  <th className="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="w-1/2 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chase
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers
                  .filter((user) => !user.deleted)
                  .map((user, index) => (
                    <tr
                      key={index}
                      className={`hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                        {user.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <img
                              className="h-8 w-8 rounded-full"
                              src={
                                user.profile?.image_32 ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  user.real_name || user.name
                                )}&background=4f46e5&color=fff`
                              }
                              alt={user.real_name || user.name}
                            />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {user.real_name || user.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              @{user.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.profile?.email || (
                          <span className="text-gray-400 italic">No email</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {(!user.is_bot && user.id !== "USLACKBOT") && <button>🪿</button>}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No users found</p>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Users;
