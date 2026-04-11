import ApprovalCard from '@club/components/ApprovalCard';
import DashboardCard from '@dashboard/components/DashboardCard';

function ApprovalSection({ items = [] }) {
  return (
    <DashboardCard actionLabel="Review All" icon="approvals" title="Approval Workbench">
      <div className="space-y-3">
        {items.length ? (
          items.map((approval) => <ApprovalCard approval={approval} key={approval._id} />)
        ) : (
          <p className="text-sm text-[var(--color-text-secondary)]">
            No approval steps are currently assigned to you.
          </p>
        )}
      </div>
    </DashboardCard>
  );
}

export default ApprovalSection;
