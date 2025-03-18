
const DashboardProfile = () => {
    return(
        <div>
            <div>
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 flex flex-col items-center justify-center mb-6 md:mb-0">
                    <img 
                      src={user.avatar} 
                      alt="Profile" 
                      className="h-32 w-32 rounded-full mb-4" 
                    />
                    <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm">
                      Change Avatar
                    </button>
                  </div>
                  <div className="md:w-2/3">
                    <h3 className="text-xl font-semibold mb-6">Edit Profile</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Name
                        </label>
                        <input 
                          type="text" 
                          className="w-full p-2 border border-gray-300 rounded"
                          value={user.name}
                          onChange={(e) => setUser({...user, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input 
                          type="email" 
                          className="w-full p-2 border border-gray-300 rounded"
                          value={user.email}
                          onChange={(e) => setUser({...user, email: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Biography
                        </label>
                        <textarea 
                          className="w-full p-2 border border-gray-300 rounded h-32"
                          value={user.bio}
                          onChange={(e) => setUser({...user, bio: e.target.value})}
                        />
                      </div>
                      <div className="flex justify-end">
                        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white shadow rounded-lg p-6 mt-6">
                <h3 className="text-xl font-semibold mb-6">Account Security</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <input 
                      type="password" 
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <input 
                      type="password" 
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <input 
                      type="password" 
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                      Update Password
                    </button>
                  </div>
                </div>
              </div>
            </div>
        </div>
    )
}

export default DashboardProfile;