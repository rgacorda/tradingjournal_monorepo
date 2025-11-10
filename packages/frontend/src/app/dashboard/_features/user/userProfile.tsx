import { Toaster } from "sonner";
import { ChangePassword } from "./components/ChangePassword";
import { DeleteAccount } from "./components/DeleteAccount";
import { ProfileInfo } from "./components/ProfileInfo";

function UserProfile() {
  return (
    <>
      <div className="container mx-auto px-4 lg:px-6 py-6">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <ProfileInfo />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChangePassword />
            <DeleteAccount />
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
}

export default UserProfile;