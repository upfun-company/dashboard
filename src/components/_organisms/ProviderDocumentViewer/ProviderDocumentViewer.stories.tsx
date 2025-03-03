import type { Meta, StoryObj } from "@storybook/react";
import ProviderDocumentViewer, {
  ProviderDocument,
} from "./ProviderDocumentViewer";
import { Tabs } from "@/components/ui/tabs";

/**
 * Le composant ProviderDocumentViewer permet de visualiser et valider les documents
 * soumis par un prestataire dans le cadre du processus de validation.
 */
const meta: Meta<typeof ProviderDocumentViewer> = {
  title: "Organisms/ProviderDocumentViewer",
  component: ProviderDocumentViewer,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Interface de visualisation et de validation des documents soumis par un prestataire.",
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <Tabs defaultValue="all">
        <Story />
      </Tabs>
    ),
  ],
  argTypes: {
    onBack: { action: "retour" },
    onApproveDocument: { action: "document approuvé" },
    onRejectDocument: { action: "document rejeté" },
    onApproveAll: { action: "tous les documents approuvés" },
    onDownload: { action: "document téléchargé" },
  },
};

export default meta;
type Story = StoryObj<typeof ProviderDocumentViewer>;

// Données de test pour les documents
const mockDocuments: ProviderDocument[] = [
  {
    id: "doc1",
    name: "Carte d'identité.jpg",
    type: "identity",
    fileType: "image",
    url: "https://images.unsplash.com/photo-1633265486064-086b219458ec?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    uploadDate: new Date(2023, 8, 10).toISOString(),
    status: "pending",
  },
  {
    id: "doc2",
    name: "Certification professionnelle.pdf",
    type: "certification",
    fileType: "pdf",
    url: "https://example.com/certification.pdf",
    uploadDate: new Date(2023, 8, 9).toISOString(),
    status: "pending",
  },
  {
    id: "doc3",
    name: "Attestation d'assurance.pdf",
    type: "insurance",
    fileType: "pdf",
    url: "https://example.com/insurance.pdf",
    uploadDate: new Date(2023, 8, 8).toISOString(),
    status: "pending",
  },
  {
    id: "doc4",
    name: "Diplôme.jpg",
    type: "certification",
    fileType: "image",
    url: "https://images.unsplash.com/photo-1589330694653-ded6df03f754?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    uploadDate: new Date(2023, 8, 7).toISOString(),
    status: "approved",
  },
  {
    id: "doc5",
    name: "Justificatif de domicile.pdf",
    type: "other",
    fileType: "pdf",
    url: "https://example.com/address.pdf",
    uploadDate: new Date(2023, 8, 6).toISOString(),
    status: "rejected",
    comment:
      "Document trop ancien (plus de 3 mois). Veuillez fournir un justificatif plus récent.",
  },
];

// Documents avec statuts mixtes
const mixedStatusDocuments: ProviderDocument[] = [
  mockDocuments[0], // pending
  mockDocuments[3], // approved
  mockDocuments[4], // rejected
];

// Documents tous en attente
const allPendingDocuments: ProviderDocument[] = mockDocuments
  .slice(0, 3)
  .map((doc) => ({
    ...doc,
    status: "pending",
  }));

// Documents tous approuvés
const allApprovedDocuments: ProviderDocument[] = mockDocuments
  .slice(0, 3)
  .map((doc) => ({
    ...doc,
    status: "approved",
  }));

export const Default: Story = {
  args: {
    providerId: "p1",
    providerName: "Aventure Outdoor",
    documents: mockDocuments,
  },
};

export const WithMixedStatus: Story = {
  args: {
    providerId: "p1",
    providerName: "Aventure Outdoor",
    documents: mixedStatusDocuments,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Affiche des documents avec différents statuts (en attente, approuvé, rejeté).",
      },
    },
  },
};

export const AllPending: Story = {
  args: {
    providerId: "p2",
    providerName: "Yoga Zen Studio",
    documents: allPendingDocuments,
  },
  parameters: {
    docs: {
      description: {
        story: "Tous les documents sont en attente de validation.",
      },
    },
  },
};

export const AllApproved: Story = {
  args: {
    providerId: "p3",
    providerName: "Cuisine Créative",
    documents: allApprovedDocuments,
  },
  parameters: {
    docs: {
      description: {
        story: "Tous les documents ont été approuvés.",
      },
    },
  },
};

export const Empty: Story = {
  args: {
    providerId: "p4",
    providerName: "Tour Historique",
    documents: [],
  },
  parameters: {
    docs: {
      description: {
        story: "Aucun document n'a été soumis par le prestataire.",
      },
    },
  },
};

export const WithCallbacks: Story = {
  args: {
    providerId: "p1",
    providerName: "Aventure Outdoor",
    documents: mockDocuments,
    onBack: () => console.log("Retour à la liste"),
    onApproveDocument: (docId) => console.log(`Document approuvé: ${docId}`),
    onRejectDocument: (docId, reason) =>
      console.log(`Document rejeté: ${docId}, Raison: ${reason}`),
    onApproveAll: () => console.log("Tous les documents approuvés"),
    onDownload: (docId) => console.log(`Document téléchargé: ${docId}`),
  },
};
