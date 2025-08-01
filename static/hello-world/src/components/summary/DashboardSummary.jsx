import React from 'react';
import './DashboardSummary.css';

// Atlaskit Icons
import TaskIcon from '@atlaskit/icon/glyph/task';
import PersonIcon from '@atlaskit/icon/glyph/person';
import WatchIcon from '@atlaskit/icon/glyph/watch';
import ScheduleIcon from '@atlaskit/icon/glyph/schedule';
import ListIcon from '@atlaskit/icon/glyph/list';
import WarningIcon from '@atlaskit/icon/glyph/warning';

const DashboardSummary = ({ filteredData, formatSecondsToHrMin }) => {
  const totalIssues = filteredData.length;
  const unassignedIssues = filteredData.filter(item => !item.fields.assignee).length;

  const averageETA = (() => {
    const etas = filteredData.map(item => item.fields.timeoriginalestimate).filter(Boolean);
    const avgEta = etas.length > 0 ? etas.reduce((a, b) => a + b, 0) / etas.length : 0;
    return formatSecondsToHrMin(avgEta);
  })();

  const totalTimeSpent = (() => {
    const total = filteredData.map(item => item.fields.timespent).filter(Boolean).reduce((a, b) => a + b, 0);
    return formatSecondsToHrMin(total);
  })();

  const backlogIssues = filteredData.filter(
    item => item.fields.status?.name?.toLowerCase() === 'backlog'
  ).length;

  const overdueIssues = (() => {
    const today = new Date();
    return filteredData.filter(item => {
      const dueDate = item.fields.duedate ? new Date(item.fields.duedate) : null;
      const status = item.fields.status?.name?.toLowerCase();
      return dueDate && dueDate < today && status !== 'done';
    }).length;
  })();

  return (
    <div className="dashboard-overview">
      <div className="dashboard-item">
        <div className="item-header">
          <TaskIcon label="Total Issues" size="medium" />
          <strong>Total Issues</strong>
        </div>
        <div className="item-value">{totalIssues}</div>
      </div>

      <div className="dashboard-item">
        <div className="item-header">
          <PersonIcon label="Unassigned Issues" size="medium" />
          <strong>Unassigned Issues</strong>
        </div>
        <div className="item-value">{unassignedIssues}</div>
      </div>

      <div className="dashboard-item">
        <div className="item-header">
          <WatchIcon label="Average ETA" size="medium" />
          <strong>Average ETA</strong>
        </div>
        <div className="item-value">{averageETA}</div>
      </div>

      <div className="dashboard-item">
        <div className="item-header">
          <ScheduleIcon label="Total Time Spent" size="medium" />
          <strong>Total Time Spent</strong>
        </div>
        <div className="item-value">{totalTimeSpent}</div>
      </div>

      <div className="dashboard-item">
        <div className="item-header">
          <ListIcon label="Backlog Issues" size="medium" />
          <strong>Issues in Backlog</strong>
        </div>
        <div className="item-value">{backlogIssues}</div>
      </div>

      <div className="dashboard-item">
        <div className="item-header">
          <WarningIcon label="Overdue Issues" size="medium" />
          <strong>Overdue Issues</strong>
        </div>
        <div className="item-value">{overdueIssues}</div>
      </div>
    </div>
  );
};

export default DashboardSummary;
