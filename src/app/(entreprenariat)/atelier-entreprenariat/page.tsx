import ProgrammeLayout from "@/components/layout/ProgrammeLayout";

export default function AtelierEntreprenariat() {
  const programme = {
    titre: "Atelier entreprenariat",
    description: "",
  };
  return (
    <>
      <ProgrammeLayout
        className="bg-[url('/images/entreprenariat.jpeg')] bg-cover bg-fixed bg-center lg:bg-top"
        {...programme}
      >
        <section></section>
      </ProgrammeLayout>
    </>
  );
}
