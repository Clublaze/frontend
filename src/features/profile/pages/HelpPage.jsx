import PageHeader from '@ds/components/PageHeader';
import DashboardCard from '@dashboard/components/DashboardCard';

const FAQ = [
  {
    q: 'How do I join a club?',
    a: 'Go to the Clubs page from the sidebar, find a club you are interested in, and click "Join Club". Your application will be reviewed by the club lead.',
  },
  {
    q: 'How long does membership approval take?',
    a: 'The club lead reviews your application. This typically takes 1-3 working days. You can track the status on your Memberships page.',
  },
  {
    q: 'How do I create an event?',
    a: 'If you are a Club Lead, navigate to the Events page and click "Create Event". After creating the event, submit a budget and then submit the event for approval.',
  },
  {
    q: 'What is the approval workflow for events?',
    a: 'Events go through a multi-step approval process defined by your society governance configuration. For Technova clubs, the chain is: Secretary -> Vice President -> President -> Faculty Advisor.',
  },
  {
    q: 'What is an ECR?',
    a: 'An Event Completion Report must be submitted within a few days of your event completing. It documents actual participants, outcomes, and lessons learned.',
  },
  {
    q: 'I submitted my event but it was rejected. What now?',
    a: 'You will see the rejection reason on your Events page. Edit your event to address the feedback, then click "Resubmit" to start the approval process again.',
  },
  {
    q: 'How do I get a role in a club or society?',
    a: 'Roles like Club Lead, Secretary, and President are assigned by users with the Assign Roles permission. Contact your club or society leadership.',
  },
  {
    q: 'How do I reset my password?',
    a: 'Go to Settings from the sidebar for guidance. In this build, password reset is handled by your university administrator.',
  },
];

function HelpPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Help & Support"
        description="Find answers to common questions about UniHub."
      />

      <DashboardCard icon="help" title="Frequently Asked Questions">
        <div className="divide-y divide-[var(--color-border)]">
          {FAQ.map((item) => (
            <details key={item.q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium text-[var(--color-text-primary)] marker:hidden">
                {item.q}
                <span className="shrink-0 text-[var(--color-text-secondary)] transition-transform duration-200 group-open:rotate-180">
                  v
                </span>
              </summary>
              <p className="mt-3 text-sm leading-6 text-[var(--color-text-secondary)]">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </DashboardCard>

      <DashboardCard icon="help" title="Contact Support">
        <div className="space-y-3 text-sm text-[var(--color-text-secondary)]">
          <p>
            For issues not covered in the FAQ, contact your club or society coordinator directly,
            or raise a support request with the university administration.
          </p>
          <p>
            For technical issues with the UniHub platform, email:{' '}
            <span className="text-[var(--color-brand)]">support@unihub.university</span>
          </p>
        </div>
      </DashboardCard>
    </div>
  );
}

export default HelpPage;
