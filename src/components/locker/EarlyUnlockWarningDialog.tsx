import React, { useState } from 'react';
import { AlertTriangle, DollarSign, Clock, Zap, X } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { LockedPosition, PenaltyCalculation } from '../../hooks/locker/types';

interface EarlyUnlockWarningDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lock: LockedPosition;
  penalty: PenaltyCalculation;
  onConfirm: () => void;
  processing: boolean;
}

const EarlyUnlockWarningDialog = ({
  open,
  onOpenChange,
  lock,
  penalty,
  onConfirm,
  processing
}: EarlyUnlockWarningDialogProps) => {
  const [confirmationChecked, setConfirmationChecked] = useState(false);
  
  const now = Date.now() / 1000;
  const isUnlocked = now >= lock.unlockTime;
  const hasPenalty = penalty.penalty > 0 && !isUnlocked;

  const handleConfirm = () => {
    onConfirm();
    setConfirmationChecked(false);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setConfirmationChecked(false);
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md mx-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-xl">
            {hasPenalty ? (
              <>
                <AlertTriangle className="w-6 h-6 text-red-500" />
                Early Unlock Warning
              </>
            ) : (
              <>
                <Zap className="w-6 h-6 text-green-500" />
                Confirm Unlock
              </>
            )}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left">
            {hasPenalty ? (
              "You are about to unlock your tokens before the lock period ends."
            ) : (
              "Your lock period has completed. You can unlock without any penalty."
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4">
          {/* Lock Details */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Lock Amount</span>
              <span className="font-semibold">{lock.amount.toLocaleString()} ARK</span>
            </div>
            
            {hasPenalty && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Time Remaining</span>
                  <span className="font-semibold flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {lock.daysRemaining} days
                  </span>
                </div>
                
                <div className="border-t pt-3 mt-3">
                  <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-3">
                    <div className="text-center space-y-2">
                      <div className="text-red-600 dark:text-red-400 font-bold text-lg">
                        YOU WILL LOSE {penalty.penalty.toFixed(0)} ARK
                      </div>
                      <div className="text-sm text-red-600 dark:text-red-400">
                        Penalty: {penalty.penaltyRate.toFixed(1)}% of locked amount
                      </div>
                    </div>
                    
                    <div className="mt-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Penalty Amount:</span>
                        <span className="text-red-600 dark:text-red-400 font-semibold">
                          -{penalty.penalty.toFixed(0)} ARK
                        </span>
                      </div>
                      <div className="flex justify-between text-sm border-t pt-2">
                        <span className="font-semibold">You Will Receive:</span>
                        <span className="font-bold text-green-600 dark:text-green-400">
                          {penalty.userReceives.toFixed(0)} ARK
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {!hasPenalty && (
              <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-3 text-center">
                <div className="text-green-600 dark:text-green-400 font-bold">
                  No Penalty - Full Amount Available
                </div>
                <div className="text-sm text-green-600 dark:text-green-400 mt-1">
                  You will receive the full {lock.amount.toLocaleString()} ARK
                </div>
              </div>
            )}
          </div>

          {/* Confirmation Checkbox for Penalty */}
          {hasPenalty && (
            <div className="flex items-start space-x-2 p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
              <Checkbox
                id="penalty-confirmation"
                checked={confirmationChecked}
                onCheckedChange={(checked) => setConfirmationChecked(checked === true)}
                className="mt-1"
              />
              <label
                htmlFor="penalty-confirmation"
                className="text-sm text-red-700 dark:text-red-300 leading-relaxed cursor-pointer"
              >
                I understand that I will lose <strong>{penalty.penalty.toFixed(0)} ARK</strong> ({penalty.penaltyRate.toFixed(1)}%) by unlocking early and I want to proceed anyway.
              </label>
            </div>
          )}
        </div>

        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel onClick={handleCancel} disabled={processing}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={processing || (hasPenalty && !confirmationChecked)}
            className={hasPenalty ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
          >
            {processing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </div>
            ) : hasPenalty ? (
              "Confirm Early Unlock"
            ) : (
              "Confirm Unlock"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EarlyUnlockWarningDialog;