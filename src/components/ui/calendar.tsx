import * as React from 'react';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogPortal,
  DialogOverlay,
} from '@/components/ui/dialog';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

interface CalendarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function Calendar({ open, onOpenChange }: CalendarProps) {
  const handleDateSelect = (selectInfo: any) => {
    // Handle date selection here
    onOpenChange(false);
  };

  return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogPortal>
          <DialogOverlay className="z-[9999]" />
          <DialogContent className="sm:max-w-[425px] p-0 z-[10000]">
            <DialogHeader className="px-4 py-2 border-b flex flex-row items-center justify-between">
              <DialogTitle>Change Date</DialogTitle>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 p-0 hover:bg-gray-100 rounded-full"
                onClick={() => onOpenChange(false)}
              >
                <X className="h-4 w-4 text-gray-500 hover:text-gray-900" />
                <span className="sr-only">Close</span>
              </Button>
            </DialogHeader>
            <div className="p-2 custom-calendar [&_.fc-daygrid-day]:cursor-pointer [&_.fc-daygrid-day:hover]:bg-gray-50">
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                selectable={true}
                select={handleDateSelect}
                headerToolbar={{
                  left: 'prev',
                  center: 'title',
                  right: 'next'
                }}
                height={350}
                dayMaxEvents={true}
                firstDay={1}
                fixedWeekCount={false}
                showNonCurrentDates={false}
                selectMirror={true}
                unselectAuto={false}
              />
            </div>
            <div className="flex items-center justify-end gap-2 p-2 border-t">
              <Button 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="h-8"
              >
                Clear
              </Button>
              <Button 
                variant="add"
                onClick={() => onOpenChange(false)}
                className="h-8"
              >
                Save and Finish
              </Button>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
  );
}
