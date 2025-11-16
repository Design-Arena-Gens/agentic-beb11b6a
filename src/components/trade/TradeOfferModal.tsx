"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import type { Item } from "@/types";
import { useForm } from "react-hook-form";

type Props = {
  open: boolean;
  onClose: () => void;
  recipientItem: Item | null;
  userItems: Item[];
  onSubmit: (payload: { senderItemId: string; message: string }) => Promise<void>;
  submitting: boolean;
};

type TradeForm = {
  senderItemId: string;
  message: string;
};

export const TradeOfferModal = ({
  open,
  onClose,
  recipientItem,
  userItems,
  onSubmit,
  submitting
}: Props) => {
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<TradeForm>();

  const handleClose = () => {
    reset();
    setError(null);
    onClose();
  };

  const submitHandler = handleSubmit(async (data) => {
    try {
      await onSubmit(data);
      reset();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to submit trade offer.");
    }
  });

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-6">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 translate-y-2"
              enterTo="opacity-100 translate-y-0"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-2"
            >
              <Dialog.Panel className="w-full max-w-xl overflow-hidden rounded-3xl bg-white p-6 shadow-2xl">
                <Dialog.Title className="text-xl font-semibold text-slate-900">
                  Send trade offer
                </Dialog.Title>
                <Dialog.Description className="mt-1 text-sm text-slate-500">
                  {recipientItem
                    ? `Offer one of your items in exchange for “${recipientItem.title}”.`
                    : "Select one of your items to offer."}
                </Dialog.Description>

                <form onSubmit={submitHandler} className="mt-6 space-y-4">
                  <div>
                    <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Your item
                    </label>
                    <select
                      {...register("senderItemId", { required: "Select one of your items" })}
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                    >
                      <option value="">Choose item</option>
                      {userItems.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.title}
                        </option>
                      ))}
                    </select>
                    {errors.senderItemId ? (
                      <p className="mt-1 text-xs text-rose-500">{errors.senderItemId.message}</p>
                    ) : null}
                  </div>
                  <div>
                    <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Message
                    </label>
                    <textarea
                      rows={4}
                      {...register("message", {
                        required: "Add a friendly message",
                        minLength: { value: 12, message: "Share a little more detail." }
                      })}
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                    />
                    {errors.message ? (
                      <p className="mt-1 text-xs text-rose-500">{errors.message.message}</p>
                    ) : null}
                  </div>
                  {error ? <p className="text-sm text-rose-500">{error}</p> : null}
                  <div className="flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="rounded-full bg-primary-500 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-75"
                    >
                      {submitting ? "Sending…" : "Send offer"}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
