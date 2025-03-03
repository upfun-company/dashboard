import type { Meta, StoryObj } from "@storybook/react";
import {
  TransactionDetails,
  TransactionDetailsModal,
} from "./TransactionDetails";
import { generateMockFinancialTransactions } from "@/mocks/financeMocks";

const meta: Meta<typeof TransactionDetails> = {
  title: "Organisms/TransactionDetails",
  component: TransactionDetails,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    onClose: { action: "onClose" },
    onDownloadInvoice: { action: "onDownloadInvoice" },
    onPrintInvoice: { action: "onPrintInvoice" },
    onRetryTransaction: { action: "onRetryTransaction" },
    onCancelTransaction: { action: "onCancelTransaction" },
    onViewReservation: { action: "onViewReservation" },
  },
};

export default meta;
type Story = StoryObj<typeof TransactionDetails>;

// Générer des données de test
const mockTransactions = generateMockFinancialTransactions(5);
const sampleTransaction = mockTransactions[0];

export const Default: Story = {
  args: {
    transaction: sampleTransaction,
    isModal: false,
  },
};

export const AsModal: Story = {
  args: {
    transaction: sampleTransaction,
    isModal: true,
  },
};

export const PendingTransaction: Story = {
  args: {
    transaction: {
      ...sampleTransaction,
      status: "pending",
    },
    isModal: false,
  },
};

export const FailedTransaction: Story = {
  args: {
    transaction: {
      ...sampleTransaction,
      status: "failed",
    },
    isModal: false,
  },
};

// Story pour le composant modal
export const Modal: StoryObj<typeof TransactionDetailsModal> = {
  render: (args) => <TransactionDetailsModal {...args} />,
  args: {
    transaction: sampleTransaction,
    isOpen: true,
    onOpenChange: () => {},
  },
};
