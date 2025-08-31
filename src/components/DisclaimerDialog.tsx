import React from 'react';
import { Terminal, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface DisclaimerDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const DisclaimerDialog = ({ isOpen, onClose }: DisclaimerDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-black/90 backdrop-blur-xl border border-cyan-500/30 text-white">
        {/* Quantum Background Effects */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-radial from-teal-900/10 via-black/50 to-black"></div>
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent animate-pulse"></div>
        </div>

        <div className="relative z-10">
          {/* Header */}
          <DialogHeader className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                <span className="text-xs font-mono text-yellow-400 tracking-wider">WARNING_NOTICE</span>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-yellow-500/50 to-transparent"></div>
            </div>
            
            <DialogTitle className="text-2xl font-mono bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent">
              No Expectations on Third-Party Work
            </DialogTitle>
            
            <DialogDescription className="text-gray-400 font-mono text-sm">
              Important Notice: Third-Party Contributions and Community Development
            </DialogDescription>
          </DialogHeader>

          {/* Content */}
          <div className="space-y-6 text-gray-300">
            <p className="leading-relaxed">
              ARK Token operates as a decentralized community-driven project. Any tools, applications, dashboards, smart contracts, or other developments created by community members, third-party developers, or external contributors are provided on an "as-is" basis without any warranties or guarantees.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <h3 className="font-mono text-cyan-400 text-lg tracking-wider">KEY_POINTS</h3>
              </div>

              <div className="space-y-4 pl-4 border-l border-cyan-500/20">
                <div>
                  <h4 className="font-mono text-yellow-400 mb-2 flex items-center gap-2">
                    <span className="w-1 h-1 bg-yellow-400 rounded-full"></span>
                    No Liability:
                  </h4>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    ARK Token and its core team assume no responsibility for the functionality, accuracy, security, or performance of third-party developed tools or applications.
                  </p>
                </div>

                <div>
                  <h4 className="font-mono text-yellow-400 mb-2 flex items-center gap-2">
                    <span className="w-1 h-1 bg-yellow-400 rounded-full"></span>
                    Community Contributions:
                  </h4>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    All community-built features, including but not limited to burn tracking dashboards, analytics tools, and utility applications, are independent contributions and do not represent official ARK Token products.
                  </p>
                </div>

                <div>
                  <h4 className="font-mono text-yellow-400 mb-2 flex items-center gap-2">
                    <span className="w-1 h-1 bg-yellow-400 rounded-full"></span>
                    Use at Your Own Risk:
                  </h4>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Users interact with third-party tools and applications at their own discretion and risk. Always verify information independently and exercise caution.
                  </p>
                </div>

                <div>
                  <h4 className="font-mono text-yellow-400 mb-2 flex items-center gap-2">
                    <span className="w-1 h-1 bg-yellow-400 rounded-full"></span>
                    No Endorsement:
                  </h4>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    The inclusion or mention of third-party tools does not constitute an endorsement by ARK Token or guarantee their continued operation or support.
                  </p>
                </div>

                <div>
                  <h4 className="font-mono text-yellow-400 mb-2 flex items-center gap-2">
                    <span className="w-1 h-1 bg-yellow-400 rounded-full"></span>
                    Independent Verification:
                  </h4>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Users are encouraged to independently verify all data, transactions, and information provided by community-developed tools.
                  </p>
                </div>

                <div>
                  <h4 className="font-mono text-yellow-400 mb-2 flex items-center gap-2">
                    <span className="w-1 h-1 bg-yellow-400 rounded-full"></span>
                    No Support Obligations:
                  </h4>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    ARK Token is not obligated to provide support, maintenance, or updates for third-party developed applications or tools.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mt-6">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="font-mono text-red-400 text-sm tracking-wider">ACKNOWLEDGMENT</span>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">
                By using any community-developed tools or applications related to ARK Token, you acknowledge and accept these terms and understand that you do so entirely at your own risk.
              </p>
            </div>
          </div>

          {/* Scanning Effect */}
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent animate-scan"></div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DisclaimerDialog;