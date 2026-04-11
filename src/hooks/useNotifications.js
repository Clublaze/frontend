import { useMemo } from 'react';
import { formatDate } from '@dashboard/utils/dashboardFormatters';

function sortByNewest(left, right) {
  return new Date(right.timestamp ?? 0) - new Date(left.timestamp ?? 0);
}

export function useNotifications(dashboard) {
  return useMemo(() => {
    const items = [];

    (dashboard?.approvalItems ?? []).forEach((item) => {
      items.push({
        badge: 'Approval',
        href: '/dashboard/approvals',
        id: `approval-${item._id}`,
        subtitle: item.canonicalRoleLabel ?? 'Pending review',
        timestamp: item.updatedAt ?? item.createdAt,
        title: item.eventTitle ?? 'Approval pending',
      });
    });

    (dashboard?.pendingMemberships ?? []).forEach((item) => {
      items.push({
        badge: 'Membership',
        href: '/dashboard/memberships',
        id: `membership-${item._id}`,
        subtitle: item.club?.name ?? 'Club request',
        timestamp: item.appliedAt ?? item.createdAt,
        title: `${item.studentName ?? 'A student'} requested to join`,
      });
    });

    (dashboard?.createdEvents ?? []).forEach((item) => {
      if (item.status === 'REJECTED') {
        items.push({
          badge: 'Rejected',
          href: '/dashboard/events',
          id: `event-rejected-${item._id}`,
          subtitle: item.rejectionReason ?? 'Needs revision',
          timestamp: item.updatedAt ?? item.createdAt,
          title: item.title,
        });
      }

      if (item.status === 'UNDER_REVIEW') {
        items.push({
          badge: 'Review',
          href: '/dashboard/events',
          id: `event-review-${item._id}`,
          subtitle: 'Waiting in approval workflow',
          timestamp: item.updatedAt ?? item.createdAt,
          title: item.title,
        });
      }
    });

    (dashboard?.upcomingEvents ?? []).slice(0, 4).forEach((item) => {
      items.push({
        badge: 'Upcoming',
        href: '/dashboard/events',
        id: `upcoming-${item._id}`,
        subtitle: formatDate(item.startDate),
        timestamp: item.startDate,
        title: item.title,
      });
    });

    const uniqueItems = Array.from(new Map(items.map((item) => [item.id, item])).values())
      .sort(sortByNewest)
      .slice(0, 8);

    return {
      count: uniqueItems.length,
      items: uniqueItems,
    };
  }, [dashboard]);
}
