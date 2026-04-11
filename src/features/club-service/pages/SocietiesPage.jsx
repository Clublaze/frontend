import { useOutletContext } from 'react-router-dom';
import Loader from '@ds/components/Loader';
import EmptyState from '@ds/components/EmptyState';
import PageHeader from '@ds/components/PageHeader';
import SocietyCard from '@club/components/SocietyCard';
import { useDiscoverySocieties, useOrganizationTree } from '@club/hooks/useDiscovery';

function SocietiesPage() {
  useOutletContext();

  const societiesQuery = useDiscoverySocieties();
  const orgTree = useOrganizationTree();

  const isLoading = societiesQuery.isLoading || orgTree.isLoading;
  const { byId, units } = orgTree.data ?? { byId: new Map(), units: [] };
  const societies = societiesQuery.data ?? [];

  const groupedBySchool = societies.reduce((accumulator, society) => {
    const schoolId = String(society.parentId ?? 'none');
    if (!accumulator[schoolId]) accumulator[schoolId] = [];
    accumulator[schoolId].push(society);
    return accumulator;
  }, {});

  return (
    <div className="space-y-10">
      <PageHeader
        title="Societies"
        description="Societies grouped by school - the backbone of campus life."
      />

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader size="lg" /></div>
      ) : societies.length === 0 ? (
        <EmptyState icon="societies" title="No societies found" />
      ) : (
        Object.entries(groupedBySchool).map(([schoolId, schoolSocieties]) => {
          const school = byId.get(schoolId);
          const childClubsForSociety = (societyId) =>
            units.filter(
              (unit) => String(unit.parentId) === String(societyId) && unit.type === 'CLUB',
            );

          return (
            <section key={schoolId}>
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[var(--color-brand)]">
                <span className="h-2 w-2 rounded-full bg-[var(--color-brand)]" />
                {school?.name ?? 'University'}
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {schoolSocieties.map((society) => (
                  <SocietyCard
                    key={society._id}
                    society={society}
                    childClubs={childClubsForSociety(society._id)}
                    schoolName={school?.name ?? ''}
                  />
                ))}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}

export default SocietiesPage;
