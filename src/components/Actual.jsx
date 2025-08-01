import Monthly from './Monthly';
import Daily from './Daily';

function Actual() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      padding: '20px',
    }}>
      <div style={{ flex: 2 }}>
        <Monthly />
      </div>
      <div style={{ flex: 1 }}>
        <Daily />
      </div>
    </div>
  );
}

export default Actual;
