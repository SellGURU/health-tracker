import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, Crown } from "lucide-react";

interface ProfileInfoProps {
    clientInformation:any
    brandInfo:any
    getMembershipDuration:() => string
    getSubscriptionBadge:(plan:string) => React.ReactNode
}

const ProfileInfo = ({ clientInformation, brandInfo, getMembershipDuration, getSubscriptionBadge }: ProfileInfoProps) => {
    return (
        <>
        <Card className="bg-gradient-to-br from-white/90 via-white/80 to-emerald-50/60 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-emerald-900/20 border-0 shadow-xl backdrop-blur-lg">
          <CardContent className="p-4">
            <div className="flex-1 min-w-0">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {clientInformation?.name || "User"}
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {clientInformation?.email}
                    </p>
                  </div>
                  <div className="relative flex-shrink-0">
                    <Avatar className="w-12 h-12 ring-2 ring-emerald-200/50 dark:ring-emerald-800/30 shadow-lg">
                      <AvatarFallback
                        className="text-white text-[10px] font-medium"
                        style={{
                          background: `linear-gradient(to right, ${
                            brandInfo ? brandInfo?.primary_color : `#3b82f6`
                          }, ${
                            brandInfo
                              ? brandInfo?.secondary_color
                              : `#a855f7`
                          })`,
                        }}
                      >
                        {(
                          clientInformation?.name?.split(" ")[0] || ""
                        ).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                      <Crown className="w-2 h-2 text-white" />
                    </div>
                  </div>
                </div>

                {/* Better spaced info display */}
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Age:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {clientInformation?.age || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Gender:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                      {clientInformation?.sex || "Not specified"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Member Since:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {getMembershipDuration()}
                    </span>
                  </div>
                </div>

                {/* Health stats */}
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Lab Tests:
                    </span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      {clientInformation?.lab_test}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Action Plan:
                    </span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      {clientInformation?.action_plan}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Account:
                    </span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {clientInformation?.verified_account
                        ? "Verified"
                        : "Unverified"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 pt-1">
                  {getSubscriptionBadge(clientInformation?.plan || "free")}
                  <Badge
                    variant="outline"
                    className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 text-blue-700 dark:text-blue-300 border-blue-200/50 dark:border-blue-800/30 backdrop-blur-sm text-xs"
                  >
                    <Activity className="w-3 h-3 mr-1" />
                    Active User
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>        
        </>
    )
}

export default ProfileInfo;