import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import cscLogo from '../assets/img/logo-csc.png';
import * as TfiIcons from 'react-icons/tfi';
import appConfig from './config.client.js';


function App() {
  const [data, setData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [routeDate, setRouteDate] = useState(new Date().toISOString().slice(0, 10));

  const apiHost = appConfig.host;

  const formatDate = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: '2-digit',
      year: 'numeric'
    });
  };

  const matchesSearch = (row) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return [row.lastname, row.firstname, row.docStatus]
      .some(value => (value || '').toString().toLowerCase().includes(query));
  };

  const matchesRouteDate = (row) => {
    if (!routeDate) return true;
    const rowDate = new Date(row.daterouted);
    if (Number.isNaN(rowDate.getTime())) return false;
    return rowDate.toISOString().split('T')[0] === routeDate;
  };

  const renderNav = (title) => (
    <nav style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <img src={cscLogo} alt="CSC Logo" style={{ height: '50px' }} />
        <h1>{title}</h1>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search last name, first name, status"
          style={{ padding: '10px', minWidth: '240px', borderRadius: '6px', border: '1px solid #ccc' }}
        />
        <input
          type="date"
          value={routeDate}
          onChange={(e) => setRouteDate(e.target.value)}
          style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
        />
      </div>
    </nav>
  );

  // Experimental Side Bar
  const [activePage, setActivePage] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const buttonStyle = {
    padding: "25px",
    background: "#303947",
    border: "none",
    color: "#e0e0e0",
    cursor: "pointer",
    borderRadius: "5px",
    textAlign: "left",
  };
  const cardStyle = {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  };

  // Authentication Signatories
  const [signatories, setSignatories] = useState([]);
  const [selectedSignatory, setSelectedSignatory] = useState(null);
  
  useEffect(() => {
    axios.get(`http://${apiHost}:3001/api/signatories`)
      .then(response => {
        setSignatories(response.data);
        if (response.data && response.data.length > 0) {
          setSelectedSignatory(response.data[0]);
        }
      })
      .catch(error => console.error('Failed to load signatories:', error));
  }, []);

  const handleChange = (e) => {
    const selectedName = e.target.value;
    const foundSignatory = signatories.find(
      signatory => signatory.name === selectedName
    );
    setSelectedSignatory(foundSignatory);
  };

  // DEV location
  // const imageAddress = 'C:/Users/Admin/Desktop/Development/reference/Scanned';
  // const qrAddress = 'C:/Users/Admin/Desktop/Development/reference/qrcode'

  // PROD location
  const imageAddress = appConfig.imageAddress || 'Y:/ESDDMS/Scanned 2026';
  const qrAddress = appConfig.qrAddress || 'Y:/ESDDMS/qrcode';

  const handleUploadCOE = async () => {
    const filename = await window.electronAPI.uploadCOE({ selectedRow, imageAddress });
    if (filename) {
      console.log('selectedRow.incomingid:', selectedRow.incomingid);
      await axios.post(`http://${apiHost}:3001/api/update-coe`, {
        incomingid: selectedRow.incomingid,
        authCOEImage: filename
      });
      setSelectedRow({ ...selectedRow, authCOEImage: filename });
    }
  };

  const handleUploadID = async () => {
    const filename = await window.electronAPI.uploadID({ selectedRow, imageAddress });
    if (filename) {
      console.log('selectedRow.incomingid:', selectedRow.incomingid);
      await axios.post(`http://${apiHost}:3001/api/update-id`, {
        incomingid: selectedRow.incomingid,
        authIDImage: filename
      });
      setSelectedRow({ ...selectedRow, authIDImage: filename });
    }
  };

  useEffect(() => {
    axios.get(`http://${apiHost}:3001/api/requests`)
      .then(response => setData(response.data))
      .catch(error => console.error(error));
  }, []);


  if (selectedRow) {
    return (
      <div className="detail-container">

        {/* Layout for viewing and uploading of COE and ID images, as well as printing of Authenticated copy of COE. */}
        <div className="no-print">

          <button className="print-button" onClick={() => window.print()}>Print</button>
          <button className='back-button' onClick={() => setSelectedRow(null)}>Back to list</button>
          <div className="table-container">
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px'
            }}>
              <div>
                <table className="detail-table"
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                  }}>
                  <tbody>
                    <tr>
                      <td>
                        <p>Full Name: <strong>{selectedRow.firstname} {selectedRow.mi} {selectedRow.lastname}</strong></p>
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <p>Date of Birth: <strong>{formatDate(selectedRow.dateofbirth)}</strong></p>
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <p>Place of Birth: <strong>{selectedRow.placeofbirth}</strong></p>
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <p>Eligibility: <strong>{selectedRow.Name}</strong></p>
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <p>Date of Issuance/Exam: <strong>{formatDate(selectedRow.dateofexam)}</strong></p>
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <p>Place of Issuance/Exam: <strong>{selectedRow.placeofexam}</strong></p>
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <p> </p>
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <p>Rating: <strong>{selectedRow.rating}</strong></p>
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <p>Book No.: <strong>{selectedRow.bookno}</strong></p>
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <p>Page No.: <strong>{selectedRow.pageno}</strong></p>
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <p>Sequence No.: <strong>{selectedRow.seqno}</strong></p>
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <p>Examinee No.: <strong>{selectedRow.examno}</strong></p>
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <p>Batch/School Code: <strong>{selectedRow.batchno}</strong></p>
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <p>Date Released: <strong>{formatDate(selectedRow.releasedate)}</strong></p>
                      </td>
                    </tr>

                    <tr>
                      <td>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div>
                <table className="detail-table"
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                  }}>
                  <tbody>
                    <tr style={{ height: '400px' }} onClick={handleUploadCOE}>
                      <td style={{
                        textAlign: 'center',
                        height: '100%' // Ensure cell fills row height if needed
                      }}>
                        {selectedRow.authCOEImage ? (
                          <img src={`file://${selectedRow.authCOEImage}`} alt="Auth COE Image" height="auto" width="100%" style={{ maxHeight: "400px", objectFit: "contain" }} />
                        ) : (
                          <p>Upload COE</p>
                        )}
                      </td>
                    </tr>
                    <tr style={{ height: '300px' }} onClick={handleUploadID}>
                      <td style={{
                        textAlign: 'center',
                        height: '100%' // Ensure cell fills row height if needed
                      }}>
                        {selectedRow.authIDImage ? (
                          <img src={`file://${selectedRow.authIDImage}`} alt="Auth ID Image" height="auto" width="100%" style={{ maxHeight: "300px", objectFit: "contain" }} />
                        ) : (
                          <p>Upload ID</p>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div style={{ padding: "5px", display: "flex", alignItems: "center", gap: "20px" }}>
                          <strong>Signatory</strong>
                          <br />
                          {/* DROPDOWN */}
                          <select
                            value={selectedSignatory ? selectedSignatory.name : ''}
                            onChange={handleChange}
                            style={{
                              width: "250px",
                              height: "30px",
                              padding: "5px 5px",
                              fontSize: "12px",
                              borderRadius: "8px",
                              border: "1px solid #ccc",
                            }}
                          >
                            {/* <option value="">Select Signatory</option> */}

                            {signatories.map((signatory, index) => (
                              <option
                                key={index}
                                value={signatory.name}
                              >
                                {signatory.name}
                              </option>
                            ))}
                          </select>

                          <strong>QR Code: </strong><img src={`file://${qrAddress}/${selectedRow.qr}.png`} alt="QR Code" height="80px" width="auto" />

                          {/* OUTPUT */}
                          {/* {selectedSignatory && (
                            <div style={{
                              marginTop: "10px"
                            }}>
                              <p>{selectedSignatory.position}</p>
                            </div>
                          )} */}
                        </div>
                      </td>
                    </tr>
                  </tbody>

                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Editable Print Layout - Modify this section for custom print formatting */}
        <div className="print-only print-layout">
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              tableLayout: "fixed",
            }}
          >
            {/* ROW 1 */}
            <tbody><tr style={{ height: "180px" }}>
              <td
                colSpan={6}
                style={{
                  textAlign: "center",
                }}
              >
              </td>
            </tr>

              {/* ROW 2 */}
              <tr className="detail-item" style={{ height: "300px", maxHeight: "600px" }}>
                <td
                  colSpan={6}
                  style={{
                    verticalAlign: "top",
                    padding: "0px",
                    height: "600px",
                    overflow: "hidden"
                  }}
                >
                  <img src={`file://${selectedRow.authCOEImage}`} alt="Auth COE Image" height="auto" width="100%" style={{
                    maxHeight: "600px", objectFit: "contain", border: "1px solid #b1b1b1"
                  }} />

                </td>
              </tr>

              {/* ROW 3 */}
              <tr>
                <td colSpan={3} style={{textAlign: "center"}}>
                  <img src={`file://${selectedRow.authIDImage}`} alt="Auth ID Image" width="auto" height="200px" />
                </td>
                <td className="detail-item" colSpan={3}>
                  <div style={{ borderColor: '#2b104e', borderWidth: '3px', borderStyle: 'solid', borderRadius: '15px', padding: '-20px' }}>
                    <p style={{ fontFamily: 'TimesNewRoman', color: '#102b4e', lineHeight: '1.0', fontSize: 'medium', margin: "5px" }}>
                      Republic of the Philippines
                      <br />CIVIL SERVICE COMMISSION
                      <br />Regional Office X
                      <br />Vamenta Blvd., Carmen, Cagayan de Oro City
                      <br />
                      <br />
                      <strong>CERTIFIED AUTHENTICATED COPY OF COE</strong>
                      <br />
                      <br />
                      <br />
                      <br />
                      <strong>{selectedSignatory ? selectedSignatory.name : ''}</strong>
                    </p>
                    <hr style={{ margin: "0" }} />
                    <p  style={{ fontFamily: 'TimesNewRoman', color: '#102b4e', lineHeight: '1.0', fontSize: 'medium', margin: "5px" }}>
                      {selectedSignatory ? selectedSignatory.position : ''}
                      <br />Date: {formatDate(selectedRow.daterouted)}
                    </p>
                  </div>
                </td>
              </tr>

              {/* ROW 4 */}
              <tr style={{ height: "40px", paddingTop: "-10px"}}>
                <td colSpan={5}>

                </td>
                <td
                  colSpan={1}
                  style={{
                    textAlign: "center",
                    margin: "0",
                    padding: "0"
                  }}
                >
                  <img src={`file://${qrAddress}/${selectedRow.qr}.png`} alt="QR Code" height="100px" width="auto"/>

                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    // Main Layout view with sidebar navigation and data table. Click on a row to view details and upload images.
    <div
      style={{
        display: "flex",
        height: "100vh",
      }}
    >
      {/* SIDEBAR */}
      <div
        style={{
          width: collapsed ? "80px" : "250px",
          background: "#1f2937",
          color: "#fff",
          // padding: "10px 20px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          transition: "width 0.35s ease",
        }}
      >

        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            padding: "10px",
            background: "#2b3646",
            border: "none",
            color: "#fff",
            cursor: "pointer",
            // borderRadius: "5px",
            margin: "10px",
            textAlign: "right"
          }}
        >
          {collapsed ? <TfiIcons.TfiAngleDoubleRight /> : <TfiIcons.TfiAngleDoubleLeft />}
        </button>

        {/* TOGGLE BUTTON */}
        {/* {!collapsed && <div style={{ padding: "10% 5%" }}><img src={cscLogo} alt="CSC Logo" style={{ height: '200px', width: 'auto' }} /></div>} */}
        {collapsed ? <div style={{ height: '320px' }}></div> : <div style={{ padding: "10% 5%" }}><img src={cscLogo} alt="CSC Logo" style={{ height: '200px', width: 'auto' }} /></div>}

        {!collapsed && <div style={{ padding: "0 5%" }}><h2>ESD-CAIS</h2></div>}

        <button
          onClick={() => setActivePage("dashboard")}
          style={buttonStyle}
        >
          {collapsed ? 
          // <TfiIcons.TfiPieChart />
          "DB"
           : "Dashboard"}
        </button>

        <button
          onClick={() => setActivePage("certification")}
          style={buttonStyle}
        >
          {collapsed ? 
          // <TfiIcons.TfiBook />
          "CT"
           : "Certification"}
        </button>

        <button
          onClick={() => setActivePage("authentication")}
          style={buttonStyle}
        >
          {collapsed ? 
          // <TfiIcons.TfiBookmarkAlt />
          "AU"
           : "Authentication"}
        </button>

        <button
          onClick={() => setActivePage("both")}
          style={buttonStyle}
        >
          {collapsed ? 
          // <TfiIcons.TfiGallery />
          "CA"
           : "Cert | Auth"}
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div
        style={{
          flex: 1,
          // padding: "20px",
          background: "#f1f5f9",
          overflowY: "auto",
        }}
      >
        {/* DASHBOARD */}
        {activePage === "dashboard" && (
          <div>
            {renderNav('Statistics of Requests Dashboard')}
          </div>
        )}

        {/* CERTIFICATION */}
        {activePage === "certification" && (
          <div style={cardStyle}>
            {renderNav('Requests for Certification')}
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead style={{ position: "sticky", top: 0, backgroundColor: "#2b2e83", zIndex: 1, color: "#f3f4f6" }}>
                  <tr>
                    <th>Priority</th>
                    <th>Transaction</th>
                    <th>Name</th>
                    <th>Date of Birth</th>
                    <th>Place of Birth</th>
                    <th>Issuance</th>
                    <th>Eligibility</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.filter(row => String(row.doctypeid) === "3" && matchesSearch(row) && matchesRouteDate(row)).map((row, index) => (
                    <tr style={{ borderBottom: "1px solid #ccc" }} key={index} onClick={() => setSelectedRow(row)}>
                      <td style={{ textAlign: "center" }}>{row.priono}</td>
                      <td>{row.shortname}</td>
                      <td>{row.lastname}, {row.firstname} {row.mi}.</td>
                      <td style={{ textAlign: "right" }}>{formatDate(row.dateofbirth)}</td>
                      <td>{row.placeofbirth}</td>
                      <td style={{ textAlign: "right" }}>{formatDate(row.daterouted)}</td>
                      <td>{row.Name}</td>
                      <td>{row.docStatus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        )}

        {/* AUTHENTICATION */}
        {activePage === "authentication" && (
          <div style={cardStyle}>
            {renderNav('Requests for Authentication')}
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead style={{ position: "sticky", top: 0, backgroundColor: "#2b2e83", zIndex: 1, color: "#f3f4f6" }}>
                    <tr>
                      <th>Priority</th>
                      <th>Transaction</th>
                      <th>Name</th>
                      <th>Date of Birth</th>
                      <th>Place of Birth</th>
                      <th>Issuance</th>
                      <th>Eligibility</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.filter(row => String(row.doctypeid) === "2" && matchesSearch(row) && matchesRouteDate(row)).map((row, index) => (
                      <tr style={{ borderBottom: "1px solid #ccc" }} key={index} onClick={() => setSelectedRow(row)}>
                        <td style={{ textAlign: "center" }}>{row.priono}</td>
                        <td>{row.shortname}</td>
                        <td>{row.lastname}, {row.firstname} {row.mi}.</td>
                        <td style={{ textAlign: "right" }}>{formatDate(row.dateofbirth)}</td>
                        <td>{row.placeofbirth}</td>
                        <td style={{ textAlign: "right" }}>{formatDate(row.daterouted)}</td>
                        <td>{row.Name}</td>
                        <td>{row.docStatus}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
        )}

        {/* BOTH */}
        {activePage === "both" && (
          <div style={cardStyle}>
            {renderNav('Certification and Authentication')}
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead style={{ position: "sticky", top: 0, backgroundColor: "#2b2e83", zIndex: 1, color: "#f3f4f6" }}>
                    <tr>
                      <th>Priority</th>
                      {/* <th>Transaction</th> */}
                      <th>Name</th>
                      <th>Date of Birth</th>
                      <th>Place of Birth</th>
                      <th>Issuance</th>
                      <th>Eligibility</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.filter(row => String(row.doctypeid) === "5" && matchesSearch(row) && matchesRouteDate(row)).map((row, index) => (
                      <tr style={{ borderBottom: "1px solid #ccc" }} key={index} onClick={() => setSelectedRow(row)}>
                        <td style={{ textAlign: "center" }}>{row.priono}</td>
                        {/* <td>{row.shortname}</td> */}
                        <td>{row.lastname}, {row.firstname} {row.mi}.</td>
                        <td style={{ textAlign: "right" }}>{formatDate(row.dateofbirth)}</td>
                        <td>{row.placeofbirth}</td>
                        <td style={{ textAlign: "right" }}>{formatDate(row.daterouted)}</td>
                        <td>{row.Name}</td>
                        <td>{row.docStatus}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
        )}
      </div>
    </div>
  );
}

export default App;
