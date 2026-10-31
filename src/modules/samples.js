/**
 * Sample notices for the "Try sample notices" button.
 * Dates are computed relative to today so status rules always produce
 * a meaningful mix of Urgent, Upcoming, and Expired.
 */

function fmt(d) {
  return d.toISOString().split('T')[0];
}

function daysFromNow(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
}

export function getSampleNotices() {
  return [
    {
      title: 'End Semester Examination — Data Structures',
      date: fmt(daysFromNow(1)),
      time: '10:00',
      venue: 'Hall B, Main Building',
      category: 'Academic',
      note: 'Bring hall ticket and calculator. Seating arrangement on notice board.',
      raw: 'End sem exam DS tomorrow 10 AM Hall B. Bring hall ticket.',
    },
    {
      title: 'Internship Registration Deadline',
      date: fmt(daysFromNow(2)),
      time: '23:59',
      venue: '',
      category: 'Deadline',
      note: 'Submit your resume on the placement portal before the deadline.',
      raw: 'Last date for internship registration is day after tomorrow 11:59 PM.',
    },
    {
      title: 'Tech Talk: Introduction to Machine Learning',
      date: fmt(daysFromNow(0)),
      time: '16:00',
      venue: 'Seminar Hall, CS Block',
      category: 'Event',
      note: 'Speaker: Dr. Priya Sharma from IIT Delhi. Open for all departments.',
      raw: 'Tech talk today 4 PM Seminar Hall CS Block — Intro to ML by Dr. Priya Sharma.',
    },
    {
      title: 'Inter-College Cricket Tournament',
      date: fmt(daysFromNow(5)),
      time: '09:00',
      venue: 'College Ground',
      category: 'Sports',
      note: 'Register with Sports Captain by Wednesday.',
      raw: 'Cricket tournament next week 9 AM at college ground.',
    },
    {
      title: 'Campus Placement Drive — Infosys',
      date: fmt(daysFromNow(7)),
      time: '09:30',
      venue: 'Auditorium',
      category: 'Placement',
      note: 'Eligible: CSE, IT, ECE with 7+ CGPA. Carry 2 passport photos.',
      raw: 'Infosys placement drive next Monday 9:30 AM Auditorium.',
    },
    {
      title: 'Library Book Return Deadline',
      date: fmt(daysFromNow(-1)),
      time: null,
      venue: 'Central Library',
      category: 'Deadline',
      note: 'Return overdue books to avoid a fine of ₹5 per day.',
      raw: 'Library books were due yesterday. Return ASAP. Fine ₹5/day.',
    },
  ];
}
