import {
  FiSearch,
  FiHome,
  FiLock
} from "react-icons/fi";

import { FaUser, FaHospital } from "react-icons/fa";

import { BsGrid3X3 } from "react-icons/bs";

import { MdKeyboardArrowRight } from "react-icons/md";

function Pacientes() {
  return (
    <div className="layout">
      <aside className="sidebar">
        <MdKeyboardArrowRight />

        <FiSearch />

        <FiHome />

        <FaUser className="active" />

        <FaHospital />

        <BsGrid3X3 />

        <span className="api-text">API</span>

        <FiLock />
      </aside>

      <main className="content">
        <header className="topbar">
          <h1>Pacientes</h1>
        </header>

        <section className="page">
          <div className="breadcrumb">
            <span className="home">Home</span>
            <span>›</span>
            <span>Pacientes</span>
          </div>

          <div className="filters">
            <div className="field buscar-por">
              <label>Buscar por</label>

              <select>
                <option>CPF</option>
              </select>
            </div>

            <div className="field paciente-field">
              <label>Paciente</label>

              <input
                type="text"
                placeholder="Buscar paciente"
              />

              <small>0 / 11</small>
            </div>

            <div className="field data-field">
              <label>Nascidos entre</label>

              <input
                type="text"
                placeholder="De dd/mm/aaaa"
              />
            </div>

            <div className="field data-field sem-label">
              <input
                type="text"
                placeholder="Até dd/mm/aaaa"
              />
            </div>

            <button className="btn pesquisar">
              <FiSearch />
              Pesquisar
            </button>

            <button className="btn limpar">
              Limpar
            </button>
          </div>

          <div className="table-card">
            <table>
              <thead>
                <tr>
                  <th>CPF</th>
                  <th>Nome</th>
                  <th>Nascimento</th>
                  <th>Gênero</th>
                  <th>Município</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td colSpan="5" className="empty">
                    <div className="empty-icon">📭</div>
                    <p>Nenhum paciente encontrado</p>
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="pagination">
              <div>0 - 0 de 0 resultados</div>

              <div className="pagination-right">
                <span>10 ▼</span>

                <div className="arrows">
                  <button>‹</button>
                  <button>›</button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Pacientes;