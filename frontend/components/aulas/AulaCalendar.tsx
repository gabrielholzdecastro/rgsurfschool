"use client";

import { useState, useMemo } from "react";
import { Calendar, dateFnsLocalizer, View, Event } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AulaResponse } from "@/types/aula";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Edit, Trash2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = {
  "pt-BR": ptBR,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: ptBR }),
  getDay,
  locales,
});

interface CalendarEvent extends Event {
  resource: AulaResponse;
}

interface AulaCalendarProps {
  aulas: AulaResponse[];
  isLoading?: boolean;
  error?: string;
  onRetry?: () => void;
  onDelete?: (id: number) => void;
  onPay?: (id: number) => void;
  onEdit?: (id: number) => void;
}

export function AulaCalendar({
  aulas,
  isLoading,
  error,
  onRetry,
  onDelete,
  onPay,
  onEdit,
}: AulaCalendarProps) {
  const [view, setView] = useState<View>("month");
  const [date, setDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Converter aulas para eventos do calendário
  const events: CalendarEvent[] = useMemo(() => {
    return aulas.map((aula) => {
      // Combinar data e hora para criar Date objects
      const dataStr = aula.data; // formato: yyyy-MM-dd
      const startDateTime = new Date(`${dataStr}T${aula.horaInicio}`);
      const endDateTime = new Date(`${dataStr}T${aula.horaFim}`);

      const statusLabel = aula.statusPagamento === "PAGO" ? "✓" : "⏳";

      return {
        title: `${aula.nomeAluno} - ${aula.nomeTipoAula} ${statusLabel}`,
        start: startDateTime,
        end: endDateTime,
        resource: aula,
      };
    });
  }, [aulas]);

  // Função para determinar a cor do evento baseado no status
  const eventStyleGetter = (event: CalendarEvent) => {
    const aula = event.resource;
    let backgroundColor = "#3b82f6"; // azul padrão
    let borderColor = "#2563eb";

    if (aula.statusPagamento === "PAGO") {
      backgroundColor = "#10b981"; // verde se pago
      borderColor = "#059669";
    } else {
      backgroundColor = "#f59e0b"; // amarelo se pendente
      borderColor = "#d97706";
    }

    return {
      style: {
        backgroundColor,
        borderColor,
        borderWidth: "2px",
        color: "#ffffff",
        borderRadius: "4px",
        padding: "2px 4px",
        fontSize: "0.875rem",
      },
    };
  };

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleEdit = () => {
    if (selectedEvent && onEdit) {
      onEdit(selectedEvent.resource.id);
      setIsModalOpen(false);
      setSelectedEvent(null);
    }
  };

  const handleDelete = () => {
    if (selectedEvent && onDelete) {
      if (confirm("Tem certeza que deseja excluir esta aula?")) {
        onDelete(selectedEvent.resource.id);
        setIsModalOpen(false);
        setSelectedEvent(null);
      }
    }
  };

  const handlePay = () => {
    if (selectedEvent && onPay) {
      if (confirm("Confirmar pagamento desta aula?")) {
        onPay(selectedEvent.resource.id);
        setIsModalOpen(false);
        setSelectedEvent(null);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">Carregando calendário...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          {onRetry && (
            <Button onClick={onRetry} variant="secondary">
              Tentar novamente
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (aulas.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Nenhuma aula agendada.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow p-4">
        {/* Calendário */}
        <div style={{ height: "600px" }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            view={view}
            onView={setView}
            date={date}
            onNavigate={setDate}
            onSelectEvent={handleSelectEvent}
            eventPropGetter={eventStyleGetter}
            messages={{
              next: "Próximo",
              previous: "Anterior",
              today: "Hoje",
              month: "Mês",
              week: "Semana",
              day: "Dia",
              agenda: "Agenda",
              date: "Data",
              time: "Hora",
              event: "Evento",
              noEventsInRange: "Não há eventos neste período.",
            }}
            culture="pt-BR"
          />
        </div>
      </div>

      {/* Modal de detalhes da aula */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEvent(null);
        }}
        title="Detalhes da Aula"
        size="md"
      >
        {selectedEvent && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Aluno</label>
                <p className="text-gray-900">{selectedEvent.resource.nomeAluno}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Data</label>
                <p className="text-gray-900">{formatDate(selectedEvent.resource.data)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Horário</label>
                <p className="text-gray-900">
                  {selectedEvent.resource.horaInicio} - {selectedEvent.resource.horaFim}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Tipo</label>
                <p className="text-gray-900">
                  {selectedEvent.resource.nomeTipoAula}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Valor</label>
                <p className="text-gray-900">{formatCurrency(selectedEvent.resource.valor)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Status</label>
                <p className="text-gray-900">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      selectedEvent.resource.statusPagamento === "PAGO"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {selectedEvent.resource.statusPagamento}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-gray-200">
              <Button onClick={handleEdit} variant="secondary" className="flex items-center gap-2">
                <Edit className="w-4 h-4" />
                Alterar
              </Button>
              {selectedEvent.resource.statusPagamento === "PENDENTE" && (
                <Button onClick={handlePay} variant="outline" className="flex items-center gap-2 text-green-600 border-green-600 hover:bg-green-50">
                  <CheckCircle className="w-4 h-4" />
                  Quitar
                </Button>
              )}
              <Button onClick={handleDelete} variant="danger" className="flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                Excluir
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

