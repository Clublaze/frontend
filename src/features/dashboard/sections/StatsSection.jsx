import DashboardCard from '@dashboard/components/DashboardCard';
import GlowStat from '@ds/components/GlowStat';
import ListRow from '@ds/components/ListRow';
import MiniBarChart from '@ds/components/MiniBarChart';
import MiniLineChart from '@ds/components/MiniLineChart';
import { usePermission, useIsAdmin } from '@hooks/usePermission';

function buildTrendFromItems(items = []) {
  const slots = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return slots.map((label, index) => ({
    label,
    value: items.filter((item) => {
      const date = new Date(item.startDate ?? item.timestamp ?? item.createdAt ?? item.appliedAt ?? 0);
      return Number.isFinite(date.getTime()) && date.getDay() === ((index + 1) % 7);
    }).length,
  }));
}

function StatsSection({ dashboard }) {
  const stats = dashboard.stats;
  const { can } = usePermission(dashboard.roles ?? []);
  const isAdmin = useIsAdmin();

  let statItems;

  if (isAdmin) {
    statItems = [
      { icon: 'dashboard', label: 'Org Units', theme: 'brand', value: stats.organizationUnits },
      { icon: 'clubs', label: 'Active Clubs', theme: 'success', value: stats.activeClubs },
      { icon: 'societies', label: 'Public Societies', theme: 'neutral', value: stats.publicSocieties },
      { icon: 'audit', label: 'Audit Feed Items', theme: 'danger', value: stats.auditFeedItems },
    ];
  } else if (can('APPROVE_STEP')) {
    statItems = [
      { icon: 'approvals', label: 'Pending Approvals', theme: 'brand', value: stats.approvalsPending },
      { icon: 'profile', label: 'My Roles', theme: 'neutral', value: stats.myRoles },
      { icon: 'audit', label: 'Audit Items', theme: 'success', value: stats.auditFeedItems },
      { icon: 'dashboard', label: 'Org Units', theme: 'danger', value: stats.organizationUnits },
    ];
  } else if (can('MANAGE_MEMBERS')) {
    statItems = [
      { icon: 'clubs', label: 'Managed Clubs', theme: 'brand', value: stats.managedClubs },
      { icon: 'memberships', label: 'Pending Reviews', theme: 'neutral', value: stats.pendingMembershipReviews },
      { icon: 'events', label: 'Created Events', theme: 'success', value: stats.createdEvents },
      { icon: 'approvals', label: 'Pending Approvals', theme: 'danger', value: stats.approvalsPending },
    ];
  } else {
    statItems = [
      { icon: 'memberships', label: 'Active Memberships', theme: 'brand', value: stats.membershipsActive },
      { icon: 'approvals', label: 'Pending Apps', theme: 'neutral', value: stats.membershipsPending },
      { icon: 'events', label: 'Upcoming Events', theme: 'success', value: stats.upcomingEvents },
      { icon: 'clubs', label: 'Clubs to Explore', theme: 'danger', value: stats.clubs },
    ];
  }

  const chartData = statItems.map((item) => ({ label: item.label, value: item.value ?? 0 }));
  const trendData = isAdmin
    ? buildTrendFromItems(dashboard.auditFeed)
    : can('APPROVE_STEP')
      ? buildTrendFromItems(dashboard.approvalItems)
      : can('MANAGE_MEMBERS')
        ? buildTrendFromItems(dashboard.createdEvents)
        : buildTrendFromItems(dashboard.upcomingEvents);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statItems.map((item) => (
          <GlowStat
            icon={item.icon}
            key={item.label}
            label={item.label}
            theme={item.theme}
            value={item.value}
          />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <DashboardCard icon="dashboard" title="Analytics Snapshot">
          <MiniBarChart data={chartData} />
        </DashboardCard>

        <DashboardCard icon="events" title="Trend Overview">
          <MiniLineChart data={trendData} />
          <div className="mt-4 space-y-1">
            {chartData.slice(0, 3).map((item) => (
              <ListRow
                key={item.label}
                rightText={`${item.value}`}
                subtitle="Current total"
                title={item.label}
              />
            ))}
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}

export default StatsSection;
